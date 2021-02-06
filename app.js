//www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21463320#overview

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getPercentage(current, max) {
  return current / max * 100
}

const app = Vue.createApp({
  data() {
    return {
      // playerMaxHealth: 100,
      // playerHealth: 100,
      monsterMaxHealth: 2000,
      monsterHealth: 2000,
      currentRound: 0,
      winner: null,
      logMessages: [],
      currentEnemy: 0,
      player: {
        health: 2000,
        maxHealth: 2000,
        minDamage: 120,
        maxDamage: 200,
        attacks: [
          "questionable accuracy",
          "a stern talking to",
          "a powerful hug", 
          "Christmas cheer", 
          "unsocial distancing"
        ],
        specialAttacks: [
          "a Sick Kick Flip",
          "the Ultimate Nose Punch"
        ]
      },
      enemies: [
        {
          name: ["Dasher", "Dancer", "Prancer", "Vixen", "Comet", "Cupid", "Donder", "Blitzen"][Math.floor(Math.random() * 8)],
          health: 1000,
          minDamage: 50,
          maxDamage: 160,
          attacks: [
            'a hoof on the roof. (of your skull).',
            'a gnarly bite',
            'big ol\' antlers',
            'a suprisingly rough lick',
            'a wonderfully soft tail'
          ]
        },
        {
          name: 'Reindeer (Rudolph)',
          health: 1400,
          minDamage: 100,
          maxDamage: 170,
          attacks: [
            'Light the way - A christmas burn',
            'nuggets of "coal"',
            'a long sad story about his humble beginnings',

          ]
        },
        {
          name: 'Mrs Claus',
          health: 1800,
          minDamage: 150,
          maxDamage: 250,
          attacks: [
            'a hot cocoa break - to the face',
            'a cuddle of death', 
            'gender equality'
          ]
        },
        {
          name: 'Santa',
          health: 2000,
          minDamage: 150,
          maxDamage: 300,
          attacks: [
            'Ho Ho Horendous torture',
            'a sufficiently paid elf',
            'last years milk and cookies', 
            'the sleigh',
          ]
        }
      ]

    };
  },
  computed: {
    monsterBarStyles(){
      if (this.monsterHealth < 0) {
        return { width: '0%' }
      } else {
        return { width: getPercentage(this.monsterHealth, this.monsterMaxHealth) + '%' }
      }
    },
    playerBarStyles(){
      if (this.player.health < 0) {
        return { width: '0%' }
      } else {
        return { width: getPercentage(this.player.health, this.player.maxHealth) + '%' }
      }
    },
    mayUseSpecialAttack(){
      return this.currentRound % 3 !== 0;
    }
  },
  watch: {
    "player.health": function(value){
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw"
      } else if (value < 0) {
        this.winner = "monster"
      }
    },
    monsterHealth(value){
      if (value <= 0 && this.player.health <= 0) {
        this.winner = "draw"
      } else if (value < 0) {
        if (this.enemies.length == this.currentEnemy + 1) {
          this.winner = "player"
        } else {
          this.currentEnemy++
          newMonsterHealth = this.enemies[this.currentEnemy].health
          this.monsterHealth = newMonsterHealth
          this.monsterMaxHealth = newMonsterHealth
        }
      }
    }
  },
  methods: {
    startNewGame(){
      newMonster = this.enemies[0]
      this.player.health = this.player.maxHealth,
      this.currentEnemy = 0,
      this.monsterMaxHealth = newMonster.health,
      this.monsterHealth = newMonster.health,
      this.currentRound = 0,
      this.winner = null,
      this.logMessages = []
      console.log(this.monsterMaxHealth);
      console.log(this.monsterHealth);
      console.log(newMonster);
    },
    attackMonster(){
      this.currentRound++;
      const attackIndex = getRandomValue(0, this.player.attacks.length)
      const attackValue = getRandomValue(this.player.minDamage, this.player.maxDamage)
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", this.player.attacks[attackIndex], attackValue);
      this.attackPlayer();
    },
    attackPlayer(){
      const enemy = this.enemies[this.currentEnemy]
      const attackIndex = getRandomValue(0, enemy.attacks.length)
      const attackValue = getRandomValue(enemy.minDamage, enemy.maxDamage)
      this.player.health -= attackValue;
      this.addLogMessage(enemy.name, "attack", enemy.attacks[attackIndex], attackValue);
    },
    specialAttackMonster(){
      this.currentRound++;
      const specialAttackIndex = getRandomValue(0, this.player.specialAttacks.length)
      const attackValue = getRandomValue(200, 360)
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "special-attack", this.player.specialAttacks[specialAttackIndex], attackValue);
      this.attackPlayer();
    },
    healPlayer(){
      this.currentRound++;
      const healValue = getRandomValue(150, 300)
      if (this.player.health + healValue > this.player.maxHealth) {
        this.player.health = this.player.maxHealth;
      } else {
        this.player.health += healValue;
      }
      this.addLogMessage("player", "heal", "healing word", healValue);
      this.attackPlayer();
    },
    surrender(){
      this.winner = "monster";
    },
    addLogMessage(who, what, type, value){
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionName: type,
        actionValue: value
      });
    }
  }
});

app.mount("#game");

