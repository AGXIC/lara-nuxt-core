export function transformSlotProps(props: any) {
  const formattedProps: any = {};

  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = (value as number) < 10 ? `0${value}` : String(value);
  });

  return formattedProps;
}
