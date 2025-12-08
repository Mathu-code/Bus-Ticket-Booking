export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-4 mt-10 text-center">
      <div>
        &copy; {new Date().getFullYear()} BusGo. All rights reserved. &bull; 
        <span className="ml-2">Contact: support@busgo.com</span>
      </div>
      <div className="mt-1 text-sm">
        <a href="/" className="underline mr-2">Home</a>
        <a href="/terms" className="underline mr-2">Terms</a>
        <a href="/privacy" className="underline">Privacy</a>
      </div>
    </footer>
  );
}
