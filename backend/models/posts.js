const posts = [
    {
        createdBy: "dom",
        teaser: "A big house with lots of candy on the porch",
        correctGuess: "Jackpot, so much candy",
        wrongGuess: "Better safe than sorry",
        trick: false,
        candyPoints: 50  
    },
    {
        createdBy: "Vampire",
        teaser: "You see 3 small figures dressed as ghosts walking toawrds you",
        correctGuess: "they chase you as you run but manage to evade them by jumping a fence. Nice job",
        wrongGuess: "As you approach eggs start flying towards you. Yuck!",
        trick: true,
        candyPoints: 15  
    },
    {
        createdBy: "Werewolf",
        teaser: "A full bag of candy sits in the middle of the sidewalk",
        correctGuess: "Better to eat it than go to waste :)",
        wrongGuess: "Must be a trap. Duck and Run.",
        trick: false,
        candyPoints: 35  
    }
]

module.exports = posts
