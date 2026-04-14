import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeoData } from '../lib/seo.js'

function upsertMeta(name, content, attribute = 'name') {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

function Seo() {
  const location = useLocation()

  useEffect(() => {
    const siteOrigin = import.meta.env.VITE_SITE_URL || window.location.origin
    const seo = getSeoData(location.pathname, siteOrigin)

    document.title = seo.title

    upsertMeta('description', seo.description)
    upsertMeta('keywords', seo.keywords)
    upsertMeta('robots', seo.robots)
    upsertMeta('og:type', 'website', 'property')
    upsertMeta('og:site_name', seo.siteName, 'property')
    upsertMeta('og:title', seo.title, 'property')
    upsertMeta('og:description', seo.description, 'property')
    upsertMeta('og:url', seo.canonicalUrl, 'property')
    upsertMeta('og:image', seo.image, 'property')
    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', seo.title)
    upsertMeta('twitter:description', seo.description)
    upsertMeta('twitter:image', seo.image)
    upsertLink('canonical', seo.canonicalUrl)

    const existingSchema = document.getElementById('tailordiet-seo-schema')
    if (existingSchema) {
      existingSchema.remove()
    }

    const schemaTag = document.createElement('script')
    schemaTag.id = 'tailordiet-seo-schema'
    schemaTag.type = 'application/ld+json'
    schemaTag.text = JSON.stringify(
      seo.structuredData.length === 1 ? seo.structuredData[0] : seo.structuredData,
    )
    document.head.appendChild(schemaTag)

    return () => {
      schemaTag.remove()
    }
  }, [location.pathname])

  return null
}

export default Seo
