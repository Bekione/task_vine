import { Github, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="pt-6 pb-4 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        By Bereket K.
      </p>
      <div className="flex justify-center gap-4">
        <a
          href="https://github.com/bekione"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
        <a
          href="https://linkedin.com/in/bereket-kinfe"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
    </footer>
  )
}

