type Props = {
  onClose: () => void;
};

export default function RulesModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-2 text-pricetto">How to play</h2>
        <p className="text-sm text-gray-700 mb-4">
          Group 16 products into the four categories.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Select <span className="font-semibold">4 tiles</span> that belong together, then tap <span className="font-semibold">Submit</span>.</li>
          <li>Correct groups lock in and reveal the category.</li>
          <li>Misses cost a life — you have <span className="font-semibold">4 lives</span>.</li>
          <li><span className="font-semibold">Shuffle</span> rearranges the tile positions.</li>
          <li>When you’re done, see if you can beat your friends!</li>
        </ul>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-pricetto text-white rounded">Let's play!</button>
        </div>
      </div>
    </div>
  );
}


