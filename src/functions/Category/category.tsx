import {
  BeerBottle,
  BowlSteam,
  CookingPot,
  ForkKnife,
  Hamburger,
  IceCream,
} from '@phosphor-icons/react'

export const getCategoryIcon = (categoryName: string, size?: number) => {
  if (!size) {
    size = 40
  }
  switch (categoryName) {
    case 'Entradas':
      return <ForkKnife size={size} />
    case 'Sopas':
      return <CookingPot size={size} />
    case 'Hamburguers':
      return <Hamburger size={size} />
    case 'Acompanhamentos':
      return <BowlSteam size={size} />
    case 'Bebidas':
      return <BeerBottle size={size} />
    case 'Sobremesas':
      return <IceCream size={size} />

    default:
      return null
  }
}
