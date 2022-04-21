export default function MineButton(props: any) {
  let content;
  if (props.isFlagged && !props.isOpen) {
    content = <span>F</span>;
  } else if (props.isOpen) {
    content = <span>{props.content}</span>;
  }

  return (
    <button
      type="button"
      className={
        "w-10 h-10 text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2.5 dark:focus:ring-gray-700 dark:border-gray-700" +
        (props.isOpen ? " bg-gray-500" : " bg-gray-800 hover:bg-gray-900") +
        (props.isOpen && props.content === 1 ? ` bg-green-600` : "  ") +
        (props.isOpen && props.content === 2 ? ` bg-lime-500` : "  ") +
        (props.isOpen && props.content === 3 ? ` bg-amber-400` : "  ") +
        (props.isOpen && props.content === 4 ? ` bg-orange-400` : "  ") +
        (props.isOpen && props.content === 5 ? ` bg-orange-700` : "  ") +
        (props.isOpen && props.content === 6 ? ` bg-red-500` : "  ") +
        (props.isOpen && props.content === 7 ? ` bg-red-700` : "  ") +
        (props.isOpen && props.content === 8 ? ` bg-red-900` : "  ") +
        (props.isOpen && props.content === 'B' ? ` bg-fuchsia-600` : "  ")
      }
      onClick={(event) => props.clickHandler(event, props.id)}
      onContextMenu={(event) => props.clickHandler(event, props.id)}
    >
      {content}
    </button>
  );
}
