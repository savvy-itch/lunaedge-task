export function scrollToTop(dropdownContainerRef: React.MutableRefObject<HTMLDivElement | undefined>, containerRect: DOMRect | undefined) {
  const itemRect = dropdownContainerRef.current?.children[0].getBoundingClientRect();
  if (itemRect && containerRect && dropdownContainerRef.current) {
    // move to the top of the scroll field
    if (itemRect.bottom < containerRect.bottom) {
      dropdownContainerRef.current.scrollTop += itemRect.bottom - containerRect.bottom;
    }
  }
}

export function scrollDown(dropdownContainerRef: React.MutableRefObject<HTMLDivElement | undefined>, containerRect: DOMRect | undefined, index: number) {
  const itemRect = dropdownContainerRef.current?.children[index].getBoundingClientRect();
  if (itemRect && containerRect && dropdownContainerRef.current) {
    if (itemRect.bottom > containerRect.bottom) {
      dropdownContainerRef.current.scrollTop += itemRect.bottom - containerRect.bottom;
    }
  }
}

export function scrollUp(dropdownContainerRef: React.MutableRefObject<HTMLDivElement | undefined>, containerRect: DOMRect | undefined, index: number) {
  const itemRect = dropdownContainerRef.current?.children[index].getBoundingClientRect();
  if (itemRect && containerRect && dropdownContainerRef.current) {
    if (itemRect.top < containerRect.top) {
      dropdownContainerRef.current.scrollTop -= itemRect.height;
    }
  }
}