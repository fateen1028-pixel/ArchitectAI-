import {
    Cloud,
    Database,
    Film,
    Gauge,
    HardDrive,
    KeyRound,
    MessageSquare,
    MessagesSquare,
    Monitor,
    Network,
    PanelsTopLeft,
    RadioTower,
    Scale,
    Server,
    Users,
} from "lucide-react";

export const COMPONENT_CATALOG = [
    {
        type: "CLIENT",
        label: "Client",
        description: "Web, mobile or desktop user.",
        icon: Monitor,
    },
    {
        type: "LOAD_BALANCER",
        label: "Load Balancer",
        description: "Distributes traffic across servers.",
        icon: Scale,
    },
    {
        type: "API_GATEWAY",
        label: "API Gateway",
        description: "Routes and controls API requests.",
        icon: PanelsTopLeft,
    },
    {
        type: "APPLICATION_SERVER",
        label: "Application Server",
        description: "Runs the core business logic.",
        icon: Server,
    },
    {
        type: "WEBSOCKET_SERVER",
        label: "WebSocket Server",
        description: "Maintains real-time connections.",
        icon: RadioTower,
    },
    {
        type: "CACHE",
        label: "Cache",
        description: "Stores frequently accessed data.",
        icon: Gauge,
    },
    {
        type: "DATABASE",
        label: "Database",
        description: "Stores persistent application data.",
        icon: Database,
    },
    {
        type: "MESSAGE_QUEUE",
        label: "Message Queue",
        description: "Buffers asynchronous work.",
        icon: MessageSquare,
    },
    {
        type: "MESSAGE_BROKER",
        label: "Message Broker",
        description: "Routes messages between services.",
        icon: MessagesSquare,
    },
    {
        type: "CDN",
        label: "CDN",
        description: "Delivers content near users.",
        icon: Cloud,
    },
    {
        type: "OBJECT_STORAGE",
        label: "Object Storage",
        description: "Stores files, images and videos.",
        icon: HardDrive,
    },
    {
        type: "ID_GENERATOR",
        label: "ID Generator",
        description: "Creates distributed unique IDs.",
        icon: KeyRound,
    },
    {
        type: "TRANSCODING_SERVICE",
        label: "Transcoding Service",
        description: "Processes video into multiple formats.",
        icon: Film,
    },
    {
        type: "PRESENCE_SERVICE",
        label: "Presence Service",
        description: "Tracks connected and online users.",
        icon: Users,
    },
];

export function getComponentDefinition(type) {
    return COMPONENT_CATALOG.find(
        (component) => component.type === type,
    ) ?? {
        type,
        label: "Unknown Component",
        description: "Unknown architecture component.",
        icon: Network,
    };
}