import servicesData from "@/components/Services/servicesData";

// Get all services
export function getAllServices() {
  return servicesData;
}

// Get service by slug
export function getServiceBySlug(slug: string) {
  return servicesData.find((service) => service.slug === slug);
}

// Get recent services (for homepage)
export function getRecentServices(count: number = 3) {
  return servicesData.slice(0, count);
}
