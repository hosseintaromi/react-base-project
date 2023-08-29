import { usePage } from "../hooks/usePage";
import { MessageAlert } from "../@types/commonPage";

export function Alert() {
  const { pageData } = usePage<MessageAlert>({});

  return (
    <div>
      <span>{pageData.message}</span>
    </div>
  );
}
