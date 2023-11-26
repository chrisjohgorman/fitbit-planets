import document from "document";

/**
 * Handlers for the tile list buttons. Each button navigates to a different scenario
 * involving multiple views.
 */
const buttonCallbacks = [
  ["sun-view/start",   () => import("./views/sun")],
  ["mercury-view/start",  () => import("./views/mercury")],
  ["venus-view/start",  () => import("./views/venus")],
  ["moon-view/start",  () => import("./views/moon")],
  ["mars-view/start",  () => import("./views/mars")],
  ["jupiter-view/start",  () => import("./views/jupiter")],
  ["saturn-view/start",  () => import("./views/saturn")],
  ["uranus-view/start",  () => import("./views/uranus")],
  ["neptune-view/start",  () => import("./views/neptune")],
  ["pluto-view/start",  () => import("./views/pluto")],
];

/**
 * Assign button click handlers for all items in the menu. The view's
 * associated JavaScript is loaded and executed, and the new view is loaded on
 * top of the current one.
 */
buttonCallbacks.forEach((view) => {
  const [buttonID, viewJSLoader] = view;

  document.getElementById(buttonID).addEventListener("click", () => {
    viewJSLoader().then(({ init, update }) => {
      init().then(update).catch((err) => {
        console.error(`Error loading view: ${err.message}`);
      });
    }).catch((err) => {
      console.error(`Failed to load view JS: ${buttonID} - ${err.message}`);
    });
  });
});
