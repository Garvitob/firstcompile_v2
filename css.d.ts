/**
 * Plain-CSS side-effect imports (`import "@/styles/contract.css"`) are
 * resolved by Next at build time; TypeScript has no module for them. Next's
 * own globals only declare `*.module.css`, and TypeScript 5.9 added ts(2882),
 * which flags unresolved side-effect imports — so editors running a newer TS
 * than the workspace's squiggle every stylesheet import without this.
 */
declare module "*.css";
