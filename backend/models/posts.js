const posts = [
  {
    createdBy: "dom",
    teaser: "A big house with lots of candy on the porch",
    correctGuess: "Jackpot, so much candy",
    wrongGuess:
      "Better safe than sorry, you walk away, the next time you check your candy bag its mysteriously lighter..",
    trick: false,
    candyPoints: 50,
  },
  {
    createdBy: "Vampire",
    teaser: "You see 3 small figures dressed as ghosts walking towards you...",
    correctGuess:
      "You know how this works... no eye contact and they will leave you alone. As you pass they drop some candy in your bag.",
    wrongGuess: "As you approach eggs start flying towards you. Yuck! So much candy wasted with egg yolk...",
    trick: true,
    candyPoints: 15,
  },
  {
    createdBy: "Werewolf",
    teaser: "You see a small house in the forest but its porch light is on...",
    correctGuess: "Just a sweet old Grandmother dishing out candy <3",
    wrongGuess: "You've heard Little Red Riding Hood. No shot you go out there. In fact you throw some candy into the forest just in case.",
    trick: false,
    candyPoints: 35,
  },
];

module.exports = posts;
