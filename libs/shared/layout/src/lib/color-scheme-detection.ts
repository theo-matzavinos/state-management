if (
  // check if user had saved dark as their
  // theme when accessing page before
  localStorage.getItem('theme') === 'dark' ||
  // or user's requesting dark color
  // scheme through operating system
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  // then if we have access to the document and the element
  // we add the dark class to the html element and
  // store the dark value in the localStorage
  if (document && document.documentElement) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
} else {
  // else if we have access to the document and the element
  // we remove the dark class to the html element and
  // store the value light in the localStorage
  if (document && document.documentElement) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}
