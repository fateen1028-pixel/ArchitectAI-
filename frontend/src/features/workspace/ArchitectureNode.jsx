import {
    Handle,
    Position,
} from "@xyflow/react";

import {
    getComponentDefinition,
} from "./componentCatalog.js";

export default function ArchitectureNode({
                                             data,
                                             selected,
                                         }) {
    const component =
        getComponentDefinition(data.componentType);

    const Icon = component.icon;

    return (
        <div
            className={`
        min-w-44 rounded-2xl border
        bg-[#111318] p-4 shadow-xl
        transition
        ${
                selected
                    ? "border-sky-400 shadow-sky-400/10"
                    : "border-white/10"
            }
      `}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="
          !size-3 !border-2
          !border-[#07090d] !bg-sky-400
        "
            />

            <div className="flex items-center gap-3">
        <span
            className="
            flex size-10 shrink-0
            items-center justify-center
            rounded-xl bg-sky-400/10
            text-sky-300
          "
        >
          <Icon size={19} />
        </span>

                <div className="min-w-0">
                    <p
                        className="
              truncate text-sm font-semibold
              text-white
            "
                    >
                        {data.label}
                    </p>

                    <p
                        className="
              mt-0.5 truncate text-xs
              text-zinc-500
            "
                    >
                        {component.label}
                    </p>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="
          !size-3 !border-2
          !border-[#07090d] !bg-violet-400
        "
            />
        </div>
    );
}