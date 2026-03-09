class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="bg-white border-t border-gray-100 py-8 px-6 md:px-12 mt-auto">
                <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div class="text-sm text-gray-400">
                        &copy; ${new Date().getFullYear()} FundFlow. All rights reserved.
                    </div>
                    <div class="flex gap-6 text-sm text-gray-400">
                        <a href="#" class="hover:text-black transition-colors">Privacy Policy</a>
                        <a href="#" class="hover:text-black transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        `;
    }
}
customElements.define('app-footer', AppFooter);
