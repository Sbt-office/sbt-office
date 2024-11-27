import authBackgroundImage from "@/assets/images/authBackgroundImage.png";

const AuthBackground = () => {
  return (
    <div className="w-[50rem] h-[50rem]">
      <img
        src={authBackgroundImage}
        alt="backgroundImage"
        aria-label="backgroundImage"
        draggable={false}
        className="object-contain w-full h-full"
      />
    </div>
  );
};

export default AuthBackground;
