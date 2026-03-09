class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="bg-white border-b border-gray-100 py-5 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <a href="index.html" class="text-2xl font-extrabold tracking-tighter text-black">FundFlow.</a>
                <nav class="hidden md:flex gap-8 text-sm font-medium">
                    <a href="#" class="text-gray-500 hover:text-black transition-colors duration-200">Features</a>
                    <a href="#" class="text-gray-500 hover:text-black transition-colors duration-200">How it works</a>
                    <a href="#" class="text-gray-500 hover:text-black transition-colors duration-200">Help</a>
                </nav>
                <div class="flex items-center gap-4">
                    <a href="login.html" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">Sign in</a>
                    <a href="signup.html" class="text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg">Get Started</a>
                </div>
            </header>
        `;
    }
}
customElements.define('app-header', AppHeader);
