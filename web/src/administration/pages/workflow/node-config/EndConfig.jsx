const EndConfig = ({ onSave }) => {
    return (
        <div className="space-y-3 text-xs">
            <p>This node marks the run as complete.</p>
            <button
                className="solid-button compact"
                type="button"
                onClick={() => onSave({})}
            >
                Save node
            </button>
        </div>
    )
}

export default EndConfig
