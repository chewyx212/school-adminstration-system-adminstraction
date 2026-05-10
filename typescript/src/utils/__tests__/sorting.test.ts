import { compareStudentsAlphaNumeric, SortableStudent } from '../sorting';

describe('compareStudentsAlphaNumeric', () => {
  it('sorts by name with numeric awareness and local students first on ties', () => {
    const students: SortableStudent[] = [
      { id: 3, name: 'Student 10', email: 'c@example.com', isExternal: false },
      { id: 2, name: 'Student 2', email: 'b@example.com', isExternal: true },
      { id: 1, name: 'Student 2', email: 'b@example.com', isExternal: false }
    ];

    students.sort(compareStudentsAlphaNumeric);

    expect(students.map((student) => student.id)).toEqual([1, 2, 3]);
  });
});
