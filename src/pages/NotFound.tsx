
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { localPath } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-100">404</h1>
      <h2 className="text-2xl font-medium text-gray-300 mt-4">Page not found</h2>
      <p className="text-gray-400 mt-2 mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Button asChild>
        <Link to={localPath('/')}>Go back home</Link>
      </Button>
    </div>
  );
}
