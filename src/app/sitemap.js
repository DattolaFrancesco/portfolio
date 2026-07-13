export default function sitemap() {
  const baseUrl = "https://francescodattola.com";

  const routes = ["", "/about", "/works"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}