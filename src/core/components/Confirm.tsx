import { MessageConfirm } from "../@types/commonPage";
import { usePage } from "../hooks/usePage";

export function Confirm() {
  const { close, pageData } = usePage<MessageConfirm>({});

  return (
    <>
      <div className="confirm-card">{pageData?.message}</div>
      <div className="d-flex mt-3">
        <div style={{ paddingRight: ".5rem", width: "50%" }}>
          <button
            className="btn btn-warning w-100"
            onClick={() => close(false)}
          >
            خیر
          </button>
        </div>
        <div style={{ paddingLeft: ".5rem", width: "50%" }}>
          <button className="btn btn-primary w-100" onClick={() => close(true)}>
            بله
          </button>
        </div>
      </div>
    </>
  );
}
