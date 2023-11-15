// these methods are used to add and remove story ids from localStorageF

export const loadStarredStories = (): number[] => {
    const starred = localStorage.getItem('starredStories');
    return starred ? JSON.parse(starred) : [];
  };
  
export const saveStarredStories = (starred: number[]): void => {
  localStorage.setItem('starredStories', JSON.stringify(starred));
};