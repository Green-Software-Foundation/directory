
export const Title = ({
  titleText = "Title",
  description,
}: {
  titleText: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-primary-dark">{titleText}</h1>
      {description && (
        <p className="text-sm text-gray-darker">
          {description}
        </p>
      )}
    </div>
  );
};
