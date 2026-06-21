package com.fateen.systemdesigncoachapi.attempt;

import com.fateen.systemdesigncoachapi.attempt.dto.MissingExpectedComponent;
import com.fateen.systemdesigncoachapi.attempt.dto.*;
import com.fateen.systemdesigncoachapi.challenge.Challenge;
import com.fateen.systemdesigncoachapi.challenge.ExpectedComponent;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ArchitectureCheckService {

    public CheckResult check(
            Challenge challenge,
            SubmitAttemptRequest request
    ) {
        validateStructure(request);

        Set<String> connectedNodeIds =
                request.edges()
                        .stream()
                        .flatMap(edge ->
                                java.util.stream.Stream.of(
                                        edge.source(),
                                        edge.target()
                                )
                        )
                        .collect(Collectors.toSet());

        List<String> disconnectedComponents =
                request.nodes()
                        .stream()
                        .filter(node ->
                                !connectedNodeIds.contains(node.id())
                        )
                        .map(DesignNodeRequest::label)
                        .toList();

        List<String> warnings = new ArrayList<>();

        if (request.nodes().size() < 3) {
            warnings.add(
                    "The architecture contains fewer than three components."
            );
        }

        if (request.edges().size() < 2) {
            warnings.add(
                    "The architecture contains fewer than two connections."
            );
        }

        if (!disconnectedComponents.isEmpty()) {
            warnings.add(
                    "Some architecture components are disconnected."
            );
        }

        Set<String> submittedTypes =
                request.nodes()
                        .stream()
                        .map(node ->
                                node.componentType().name()
                        )
                        .collect(Collectors.toSet());

        List<MissingExpectedComponent>
                missingExpectedComponents =
                challenge.getExpectedComponents()
                        .stream()
                        .filter(expected ->
                                !submittedTypes.contains(
                                        expected.getComponentKey()
                                )
                        )
                        .map(this::toMissingComponent)
                        .toList();

        boolean containsClient =
                request.nodes()
                        .stream()
                        .anyMatch(node ->
                                node.componentType()
                                        == ArchitectureComponentType.CLIENT
                        );

        boolean containsPersistentStorage =
                request.nodes()
                        .stream()
                        .anyMatch(node ->
                                node.componentType()
                                        == ArchitectureComponentType.DATABASE
                                        || node.componentType()
                                        == ArchitectureComponentType.OBJECT_STORAGE
                        );

        PublicArchitectureChecks publicChecks =
                new PublicArchitectureChecks(
                        request.nodes().size(),
                        request.edges().size(),
                        disconnectedComponents,
                        List.copyOf(warnings)
                );

        InternalArchitectureChecks internalChecks =
                new InternalArchitectureChecks(
                        missingExpectedComponents,
                        containsClient,
                        containsPersistentStorage
                );

        return new CheckResult(
                publicChecks,
                internalChecks
        );
    }

    private void validateStructure(
            SubmitAttemptRequest request
    ) {
        Set<String> nodeIds = new HashSet<>();

        for (DesignNodeRequest node : request.nodes()) {
            if (!nodeIds.add(node.id())) {
                throw badRequest(
                        "Duplicate node ID: " + node.id()
                );
            }
        }

        Set<String> edgeIds = new HashSet<>();
        Set<String> connections = new HashSet<>();

        for (DesignEdgeRequest edge : request.edges()) {
            if (!edgeIds.add(edge.id())) {
                throw badRequest(
                        "Duplicate edge ID: " + edge.id()
                );
            }

            if (!nodeIds.contains(edge.source())) {
                throw badRequest(
                        "Edge source does not exist: "
                                + edge.source()
                );
            }

            if (!nodeIds.contains(edge.target())) {
                throw badRequest(
                        "Edge target does not exist: "
                                + edge.target()
                );
            }

            if (edge.source().equals(edge.target())) {
                throw badRequest(
                        "A component cannot connect to itself."
                );
            }

            String connectionKey =
                    edge.source() + "->" + edge.target();

            if (!connections.add(connectionKey)) {
                throw badRequest(
                        "Duplicate connection: "
                                + connectionKey
                );
            }
        }
    }

    private MissingExpectedComponent
    toMissingComponent(
            ExpectedComponent expected
    ) {
        return new MissingExpectedComponent(
                expected.getComponentKey(),
                expected.getLabel(),
                expected.getReason()
        );
    }

    private ResponseStatusException badRequest(
            String message
    ) {
        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                message
        );
    }

    public record CheckResult(
            PublicArchitectureChecks publicChecks,
            InternalArchitectureChecks internalChecks
    ) {
    }
}