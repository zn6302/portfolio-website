import type { Testimonial } from "../types";
import { assets } from "./assets";

export const testimonials: Testimonial[] = [
  {
    quote:
      "Duncan truly understood my vision and turned it into impactful designs. The results went beyond my expectations!",
    name: "John Harris",
    role: "Marketing Director",
    avatar: assets.reviewerOne,
  },
  {
    quote:
      "He took the time to understand our goals and delivered a design that resonated perfectly with our audience.",
    name: "Michael Lee",
    role: "Product Manager",
    avatar: assets.reviewerTwo,
  },
  {
    metric: "98%",
    label: "Satisfaction Rate",
    intro: "I’ve worked with 50+ happy clients",
    tone: "dark",
  },
  {
    metric: "200%",
    label: "Growth",
    intro: "My work helped clients grow their revenue by 200%",
    tone: "purple",
  },
  {
    quote:
      "His design skills are unmatched. He transformed my ideas into a high-performing, visually striking website.",
    name: "Sarah Johnson",
    role: "CEO",
    avatar: assets.reviewerThree,
  },
  {
    quote:
      "As a small business owner, I appreciated how stress-free Duncan made the process.",
    name: "Laura Bennett",
    role: "Small Business Owner",
    avatar: assets.reviewerFour,
  },
];
