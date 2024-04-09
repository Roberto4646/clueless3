CARD_NUMBERS = {
  1: ("Suspects", "Miss Scarlet"),
  2: ("Suspects", "Professor Plum"),
  3: ("Suspects", "Mrs. Peacock"),
  4: ("Suspects", "Reverend Green"),
  5: ("Suspects", "Mrs. White"),
  6: ("Suspects", "Colonel Mustard"),
  7: ("Weapons", "Revolver"),
  8: ("Weapons", "Candlestick"),
  9: ("Weapons", "Wrench"),
  10: ("Weapons", "Knife"),
  11: ("Weapons", "Rope"),
  12: ("Weapons", "Lead Pipe"),
  13: ("Rooms", "Hall"),
  14: ("Rooms", "Lounge"),
  15: ("Rooms", "Dining Room"),
  16: ("Rooms", "Library"),
  17: ("Rooms", "Billiard Room"),
  18: ("Rooms", "Conservatory"),
  19: ("Rooms", "Kitchen"),
  20: ("Rooms", "Ballroom"),
  21: ("Rooms", "Study"),
}

def get_card_by_number(number):
    if number not in CARD_NUMBERS:
      return None

    card_type, name = CARD_NUMBERS[number]
    return card_type, name

#card_info = card.get_card_by_number(8)
#if card_info:
#  card_type, name = card_info
#  print(f"Card Information: {name} ({card_type})")