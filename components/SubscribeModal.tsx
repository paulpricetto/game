type Props = { onClose: () => void };

export default function SubscribeModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-4">
        <h2 className="text-xl font-bold mb-3">Get daily deals from Pricetto</h2>
        <div className="w-full">
          <iframe
            src="https://subscribe-forms.beehiiv.com/587fbbca-8100-4e2c-89b2-5da62ef83aab"
            data-test-id="beehiiv-embed"
            frameBorder="0"
            scrolling="no"
            style={{ width: '100%', height: 380, border: 'none', display: 'block' }}
          />
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}


