export default function ProfilePicture({
    first,
    last,
    imageUrl,
    modalCallback,
}) {
    imageUrl = imageUrl || "/default.png";

    return (
        <div>
            <img
                className="profilePicture"
                onClick={modalCallback ? () => modalCallback() : null}
                src={imageUrl}
                alt={first + last}
            />
        </div>
    );
}
