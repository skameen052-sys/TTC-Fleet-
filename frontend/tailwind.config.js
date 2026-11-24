/** Tailwind is used only by the Logistics Manager pages (LogisticsViews.jsx).
 *  - preflight is OFF so Tailwind's CSS reset does not change any other portal.
 *  - every utility is scoped under `.logistics-tw` (the Logistics <main> element),
 *    so these classes cannot leak into the Admin, Customer, Driver or other portals.
 *  @type {import('tailwindcss').Config} */
export default {
  content: ['./src/components/logistics/LogisticsViews.jsx'],
  important: '.logistics-tw',
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: []
};
