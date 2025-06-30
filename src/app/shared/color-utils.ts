/**
 * Generates a random color based on a name string
 * @param name - The name string to generate a color for
 * @returns A hex color string
 */
export function getRandomColor(name: string): string {
  const colors = [
    '#00BEE8',
    '#1FD7C1',
    '#6E52FF',
    '#9327FF',
    '#462F8A',
    '#C3FF2B',
    '#FC71FF',
    '#FF4646',
    '#FF5EB3',
    '#FF745E',
    '#FF7A00',
    '#FFA35E',
    '#FFBB2B',
    '#FFC701',
    '#FFE62B',
  ];

  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('');
}