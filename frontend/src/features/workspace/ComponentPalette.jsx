import {
    Plus,
} from "lucide-react";

import {
    COMPONENT_CATALOG,
} from "./componentCatalog.js";

export default function ComponentPalette({
                                             onAddComponent,
                                         }) {
    return (
        <aside
            className="
        rounded-2xl border border-white/8
        bg-white/[0.025] p-4
      "
        >
            <div>
                <h2 className="font-semibold">
                    Components
                </h2>

                <p
                    className="
            mt-1 text-xs leading-5
            text-zinc-500
          "
                >
                    Add components, then connect their handles.
                </p>
            </div>

            <div
                className="
          mt-5 max-h-[560px]
          space-y-2 overflow-y-auto pr-1
        "
            >
                {COMPONENT_CATALOG.map((component) => {
                    const Icon = component.icon;

                    return (
                        <button
                            key={component.type}
                            type="button"
                            onClick={() =>
                                onAddComponent(component.type)
                            }
                            className="
                group flex w-full items-center
                gap-3 rounded-xl border
                border-white/8 bg-white/[0.025]
                p-3 text-left transition
                hover:border-sky-400/20
                hover:bg-white/[0.06]
              "
                        >
              <span
                  className="
                  flex size-9 shrink-0
                  items-center justify-center
                  rounded-lg bg-white/5
                  text-zinc-300
                  group-hover:text-sky-300
                "
              >
                <Icon size={17} />
              </span>

                            <span className="min-w-0 flex-1">
                <span
                    className="
                    block truncate text-sm
                    font-medium text-zinc-200
                  "
                >
                  {component.label}
                </span>

                <span
                    className="
                    mt-0.5 block truncate
                    text-xs text-zinc-600
                  "
                >
                  {component.description}
                </span>
              </span>

                            <Plus
                                size={15}
                                className="
                  shrink-0 text-zinc-600
                  group-hover:text-sky-300
                "
                            />
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}