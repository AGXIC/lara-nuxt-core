export const useDevice = () => {
  const breakpoints = useBreakpoints({
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  })

  const isMobile = breakpoints.smaller('sm')
  const isTablet = breakpoints.between('sm', 'md')
  const isMobileOrTablet = breakpoints.smallerOrEqual('md')
  const isDesktop = breakpoints.greater('md')
  const isLargeScreen = breakpoints.greater('lg')
  const isExtraLargeScreen = breakpoints.greater('xl')

  return {
    isMobile,
    isTablet,
    isMobileOrTablet,
    isDesktop,
    isLargeScreen,
    isExtraLargeScreen,
    breakpoints,
  }
}
