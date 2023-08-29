import { usePage } from "../hooks/usePage";

export interface MenuConfig {
  options: MenuOption[];
}

export interface MenuOption {
  text: string;
  value: string;
}

export function ContextMenu() {
  const { close, pageData } = usePage<MenuConfig>({});
  return (
    <ul className="d-block bg-primary p-2 text-lite">
      {pageData.options.map((item: MenuOption) => (
        <li
          key={item.text}
          onClick={() => {
            close({
              pageData,
              value: item.value,
            });
          }}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
}
