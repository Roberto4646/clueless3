class Board:
    graph = {
        "Study": {"S-H hall", "S-L hall", "Kitchen"},
        "S-H hall": {"Study", "Hall"},
        "S-H hall": {"Study", "Library", },
    }

    def __init__(self):
        self.weaponLocations = {""}
        self.board

        