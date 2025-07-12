export const useStateManager = () => {
  const cities = useCities()
  const provinces = useProvinces()
  const counties = useCountries()

  // Return all the cities of a specific province based on province's name
  function getCitiesByProvinceName(name: string) {
    const province = provinces.find((p) => p.name === name)
    if (!province) return []
    return cities.filter((city) => city.province_id === province.id)
  }

  // Return all the cities of a specific province based on province's ID
  function getCitiesByProvinceId(id: number) {
    return cities.filter((city) => city.province_id === id)
  }

  // Return all the cities of a specific province based on province's slug
  function getCitiesByProvinceSlug(slug: string) {
    const province = provinces.find((p) => p.slug === slug)
    if (!province) return []
    return cities.filter((city) => city.province_id === province.id)
  }

  // Find city information by name
  function getCityByName(name: string) {
    return cities.filter((city) => city.name === name)
  }

  // Find city information by ID
  function getCityById(id: number) {
    return cities.filter((city) => city.id === id)
  }

  // Find city information by slug
  function getCityBySlug(slug: string) {
    return cities.filter((city) => city.slug === slug)
  }

  return {
    cities,
    provinces,
    counties,
    getCitiesByProvinceName,
    getCitiesByProvinceId,
    getCitiesByProvinceSlug,
    getCityByName,
    getCityById,
    getCityBySlug,
  }
}
