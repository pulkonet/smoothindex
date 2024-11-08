export const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = 80; // Height of the navigation bar + some padding
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}; 