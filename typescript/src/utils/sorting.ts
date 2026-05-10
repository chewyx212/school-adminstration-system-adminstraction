export interface SortableStudent {
  id: number | string;
  name: string;
  email: string;
  isExternal: boolean;
}

const compareText = (left: string, right: string): number => {
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}

export const compareStudentsAlphaNumeric = (left: SortableStudent, right: SortableStudent): number => {
  const nameCompare = compareText(left.name, right.name);
  if (nameCompare !== 0) {
    return nameCompare;
  }

  const emailCompare = compareText(left.email, right.email);
  if (emailCompare !== 0) {
    return emailCompare;
  }

  if (left.isExternal !== right.isExternal) {
    return left.isExternal ? 1 : -1;
  }

  return String(left.id).localeCompare(String(right.id), undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}
