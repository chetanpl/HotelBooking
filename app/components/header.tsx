import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-md" role="banner">
      <div className="max-w-screen-xl mx-auto px-6  py-3 flex items-center">
         <div className="ml-4 sm:ml-6 md:ml-8 lg:ml-0">
        <Image
          src="../../../pi-logo-rest-easy.svg"
          alt="Premier Inn Logo"
          width={160}
          height={35}
          priority
          className="w-24 sm:w-28 md:w-32 lg:w-40 h-auto"
        />
      </div>
      </div>
    </header>
  );
}