type FooterProps = {
  role?: "admin" | "user";
};

export default function Footer({ role = "user" }: FooterProps) {
  return (
    <footer className="mt-auto bg-black border-t px-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-200">
        <span>
          © {new Date().getFullYear()}
          {role === "admin" ? " Admin Dashboard" : " User Dashboard"}
        </span>

        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-400 transition-colors">
            Help
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
