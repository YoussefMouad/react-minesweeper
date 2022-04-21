import { Component, SyntheticEvent } from "react";
import { MineButton, ButtonsGroup } from "../../components/buttons";
import { Mine } from "../../models";

interface IProps {}

interface IState {
  grid: Mine[];
  remainingBombs: number;
}

export default class Grid extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.grid = this.getGrid();
    this.state = {
      grid: this.grid.flat(),
      remainingBombs: this.bombsNumber[this.size],
    };
  }

  private hasStarted = false;
  private size = 14;
  private bombsNumber: { [key: number]: number } = {
    10: 10, //  10
    14: 40, //  40
    20: 100, // 100
  };
  private dificulties: { [key: string]: number } = {
    Easy: 10,
    Medium: 14,
    Hard: 20,
  };
  private grid: Mine[][];

  render() {
    return (
      <div className="text-center flex flex-row justify-content-center">
        <div className="basis-1/5">
          <ButtonsGroup
            data={Object.entries(this.dificulties).map(([text, value]) => ({
              text,
              value,
            }))}
            clickHandler={this.refreshGrid}
          />
          <p>Remaining bombs: {this.state.remainingBombs}</p>
        </div>
        <div
          onContextMenu={(event) => event.preventDefault()}
          className={
            "justify-self-center inline-grid gap-1 p-2 rounded-lg dark:bg-gray-700" +
            (this.size === 10 ? " grid-cols-10" : " ") +
            (this.size === 14 ? " grid-cols-14" : " ") +
            (this.size === 20 ? " grid-cols-20" : " ")
          }
        >
          {this.state.grid.map((x) => (
            <MineButton key={x.id} {...x} clickHandler={this.handleClick} />
          ))}
        </div>
      </div>
    );
  }

  private getGrid(): Mine[][] {
    const grid = new Array(this.size);

    for (let i = 0; i < this.size; ++i) {
      grid[i] = new Array(this.size);
      for (let j = 0; j < this.size; ++j) {
        grid[i][j] = {
          id: `${i}-${j}`,
          isOpen: false,
          isFlagged: false,
          hasMine: false,
        };
      }
    }

    return grid;
  }

  private addBombs(x: number, y: number) {
    const bombs = this.getRandomIds(this.bombsNumber[this.size], x, y);

    for (let i = 0; i < this.size; ++i) {
      for (let j = 0; j < this.size; ++j) {
        this.grid[i][j].hasMine = bombs.has(`${i}-${j}`);
        this.grid[i][j].content = bombs.has(`${i}-${j}`) ? "B" : undefined;
      }
    }

    this.generateBombHintNumbers(bombs);

    this.setState({
      grid: this.grid.flat(),
    });
  }

  private refreshGrid = (size: number): void => {
    this.size = size;
    this.hasStarted = false;

    this.grid = this.getGrid();
    this.setState({
      grid: this.grid.flat(),
      remainingBombs: this.bombsNumber[size],
    });
  };

  private handleClick = (event: SyntheticEvent, id: string) => {
    event.preventDefault();

    const [x, y] = id.split("-").map((x) => +x);

    if (!this.hasStarted) {
      this.hasStarted = true;
      this.addBombs(x, y);
    }

    if (!this.grid[x][y].content && !this.grid[x][y].hasMine) {
      this.revealEmptyMines(x, y);
    }

    if (event.type === "contextmenu" && !this.grid[x][y].isOpen) {
      this.grid[x][y].isFlagged = !this.grid[x][y].isFlagged;
      const newCount =
        this.state.remainingBombs + (this.grid[x][y].isFlagged ? -1 : 1);
      this.setState({
        remainingBombs: newCount,
      });
    } else if (event.type === "click") {
      this.grid[x][y].isOpen = true;

      if (this.grid[x][y].hasMine) {
        for (let i = 0; i < this.size; ++i) {
          for (let j = 0; j < this.size; ++j) {
            if (this.grid[i][j].hasMine) this.grid[i][j].isOpen = true;
          }
        }
      }
    }

    this.setState({
      grid: this.grid.flat(),
    });
  };

  private getRandomIds(count: number, x: number, y: number): Set<string> {
    const bombs = new Set<string>();
    const excluded = new Set<string>();

    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        excluded.add(`${x + i}-${y + j}`);
      }
    }

    while (bombs.size < count) {
      const generated = `${Math.floor(Math.random() * this.size)}-${Math.floor(
        Math.random() * this.size
      )}`;

      if (excluded.has(generated)) {
        continue;
      }

      bombs.add(generated);
    }
    return bombs;
  }

  private generateBombHintNumbers(bombs: Set<string>) {
    bombs.forEach((index) => {
      const [x, y] = index.split("-").map((x) => +x);
      for (let i = -1; i <= 1; ++i) {
        for (let j = -1; j <= 1; ++j) {
          if (
            this.isInBounds(this.grid.length, x + i, y + j) &&
            !this.grid[x + i][y + j].hasMine
          ) {
            this.grid[x + i][y + j].content = this.countBombs(
              this.grid,
              x + i,
              y + j
            );
          }
        }
      }
    });
  }

  private countBombs(grid: Mine[][], x: number, y: number): number {
    let counter = 0;
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (
          this.isInBounds(grid.length, x + i, y + j) &&
          grid[x + i][y + j].hasMine
        ) {
          ++counter;
        }
      }
    }
    return counter;
  }

  private revealEmptyMines(x: number, y: number): void {
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (
          this.isInBounds(this.grid.length, x + i, y + j) &&
          !this.grid[x + i][y + j].isOpen &&
          !this.grid[x + i][y + j].hasMine
        ) {
          this.grid[x + i][y + j].isOpen = true;
          if (!this.grid[x + i][y + j].content) {
            this.revealEmptyMines(x + i, y + j);
          }
        }
      }
    }
  }

  private isInBounds(size: number, x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < size && y < size;
  }
}
