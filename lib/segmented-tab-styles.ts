/**
 * Shared segmented tab rail (leave admin + tasks view/status).
 * Rounded rail, flex-wrap (no horizontal scrollbar), glass rail.
 */
export const segmentedTabsListClass =
  "group-data-horizontal/tabs:!h-auto flex h-auto w-full min-w-0 flex-wrap items-stretch justify-stretch gap-0.5 rounded-xl border border-white/10 bg-card/40 p-1 shadow-sm backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export const segmentedTabsTriggerClass =
  "min-h-10 shrink-0 px-3.5 text-xs font-semibold data-active:bg-gradient-to-r data-active:from-emerald-500 data-active:to-cyan-500 data-active:text-white data-active:shadow-sm";
