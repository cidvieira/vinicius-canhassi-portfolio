import { useEffect, useState } from "react"

export default function HandleScroll(){
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section')
            let activeSection = ''
            sections.forEach((section) => {
              const rect = section.getBoundingClientRect()
              if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * -0.5) {
                activeSection = section.id
              }
            });
            setActiveSection(activeSection)
            
          };
      
          window.addEventListener('scroll', handleScroll)
          return () => window.removeEventListener('scroll', handleScroll);
      }, [])

      return ({ activeSection })
}