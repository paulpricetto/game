type Props = {
  onClose: () => void;
};

export default function RulesModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-2">How to play</h2>
        <p className="text-sm text-gray-600 mb-4">
          Find the four hidden categories by grouping the 16 products into four sets of four.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Select up to 4 tiles, then press <span className="font-semibold">Submit</span>.</li>
          <li>Correct sets are removed and revealed.</li>
          <li>Wrong guess loses a life. You have <span className="font-semibold">4 lives</span>.</li>
          <li>Use <span className="font-semibold">Shuffle</span> or <span className="font-semibold">Clear</span> anytime.</li>
          <li>Share your results when you finish.</li>
        </ul>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-pricetto text-white rounded">Let’s play</button>
        </div>
      </div>
    </div>
  );
}


