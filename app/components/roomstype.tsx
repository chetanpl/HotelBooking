import { RoomOption, RoomType } from "../[locale]/form";

type StepperControlProps = {
  type: RoomType;
  label: string;
  count: number;
  decrement: (type: RoomType) => void;
  increment: (type: RoomType) => void;
};

const StepperControl: React.FC<StepperControlProps> = ({ type, label, count, decrement, increment }) => (
  <div className="font-medium flex-1 text-left">
    <div className="flex flex-1 items-center gap-3 justify-center">
      {/* Decrease Button */}
      <button
        onClick={() => decrement(type)}
        disabled={count === 0}
        className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-50 bg-gray-200"
        type="button"
        aria-label={`Decrease number of ${label.toLowerCase()} rooms`}
      >
        <svg width="18" height="2" fill="gray" aria-hidden="true">
          <path d="M1 0h16a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2Z" />
        </svg>
      </button>

      {/* Count Input */}
      <input
        type="text"
        value={count ?? 0}
        readOnly
        className="w-12 text-center border rounded"
        aria-readonly="true"
        role="spinbutton"
        aria-valuenow={count ?? 0}
        aria-valuemin={0}
        aria-labelledby={`${type}-label`}
        aria-label={`Selected number of ${label.toLowerCase()} rooms`}
      />

      {/* Increase Button */}
      <button
        onClick={() => increment(type)}
        className="w-8 h-8 flex items-center justify-center border rounded-full text-blue-600 bg-blue-100"
        type="button"
        aria-label={`Increase number of ${label.toLowerCase()} rooms`}
      >
        <svg width="16" height="16" fill="blue" aria-hidden="true">
          <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H8.999L9 15a1 1 0 1 1-2 0l-.001-6H1a1 1 0 1 1 0-2h6V1a1 1 0 0 1 1-1Z" />
        </svg>
      </button>
    </div>
  </div>
);

const RoomSelector: React.FC<{ options: RoomOption[], rooms: Record<RoomType, number>;
  setRooms: React.Dispatch<React.SetStateAction<Record<RoomType, number>>>; t:any }> = ({ options, rooms, setRooms,t }) => {

const decrement = (type: RoomType) => {
  setRooms((prev) => ({
    ...prev,
    [type]: Math.max(0, (prev[type] ?? 0) - 1), 
  }));
};

const increment = (type: RoomType) => {
  setRooms((prev) => ({
    ...prev,
    [type]: (prev[type] ?? 0) + 1,
  }));
};
  return (
    <div className="space-y-6">
      {options.map(({ type, label, subtitle }) => (
        <div key={type} className="space-y-2 p-4 border shadow-md flex justify-between items-center" role="group" aria-labelledby={`${type}-label`}>
          {/* Left: Label and Subtitle */}
          <div className="font-medium flex-1 text-left">
            <div id={`${type}-label`}>{t(type)}</div>

            {/* <div id={`${type}-label`}>{label}</div> */}
            <p className="text-sm text-gray-600 my-2">{t(subtitle)}</p>
          </div>

          <div className="border-l border-gray-300 h-12" aria-hidden="true"></div>

          {/* Stepper Control */}
          <StepperControl type={type} label={label} count={rooms[type]} decrement={decrement} increment={increment} />
        </div>
      ))}

      {/* Total Summary */}
      <div className="flex justify-between items-center" role="contentinfo" aria-label="Room total summary">
        <div className="flex-1 font-medium text-left" aria-hidden="true"></div>
        <div className="flex-1 flex justify-center mt-2">
          <div className="text-base font-semibold flex items-center gap-2" role="status" aria-live="polite">
            <span id="total-label">{t('total')}:</span>
            <span aria-labelledby="total-label">
              {Object.values(rooms).reduce((total, count) => total + count, 0)} {t('rooms')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSelector;