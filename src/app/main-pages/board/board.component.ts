import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskDataService } from '../shared-data/task-data.service';
import {
  BoardColumn,
  Task,
  Subtask,
  BoardStatus,
} from '../shared-data/task.interface';
import { TaskCardComponent } from './task/task-card/task-card.component';
import { TaskDialogComponent } from './task/task-dialog/task-dialog.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TaskCreateFormComponent } from '../task-create-form/task-create-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskCardComponent,
    TaskDialogComponent,
    CdkDropList,
    TaskCreateFormComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  columns$!: Observable<BoardColumn[]>;
  filteredColumns$!: Observable<BoardColumn[]>;
  selectedTask: Task | null = null;
  showTaskDialog: boolean = false;
  isEditMode: boolean = false;
  isDragging: boolean = false;
  openAddTask: boolean = false;
  setTaskStatus!: BoardStatus;

  searchTerm: string = '';
  private searchSubject = new BehaviorSubject<string>('');
  hasSearchResults: boolean = true;
  isMobile: boolean = false;
  breakpointSubscrition?: Subscription;

  private scrollIntervalId: number | null = null;
  private scrollDirection: 'up' | 'down' | null = null;
  private isInScrollZone: boolean = false;
  @ViewChild('boardWrapper') boardWrapper!: ElementRef<HTMLDivElement>;

  constructor(
    private taskDataService: TaskDataService,
    private cdr: ChangeDetectorRef, // Hinzugefügt zur Behebung von Änderungsdetektionsproblemen // private fb: FormBuilder, // Auskommentiert - wird jetzt von TaskEditForm-Komponente behandelt // // private contactDataService: ContactDataService // Auskommentiert - wird jetzt von TaskEditForm-Komponente behandelt
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.columns$ = this.taskDataService.getBoardColumns();

    this.filteredColumns$ = combineLatest([
      this.columns$,
      this.searchSubject.asObservable(),
    ]).pipe(
      map(([columns, searchTerm]) =>
        this.filterTasksBySearchTerm(columns, searchTerm)
      )
    );
    this.breakpointSubscrition = this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscrition) {
      this.breakpointSubscrition.unsubscribe();
    }
    this.stopScroll();
  }

  // #region Drag and Drop
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (movedTask.id === undefined) return;

      movedTask.status = event.container.id as BoardStatus;

      this.taskDataService.updateTask(movedTask.id, {
        status: movedTask.status,
      });
    }
  }

  // highlights the hovered column
  // enableHighlighting(column: BoardColumn) {
  //   column.isHovered = true;
  // }

  // disableHighlighting(column: BoardColumn) {
  //   column.isHovered = false;
  // }

  dropIndication(state: boolean) {
    this.isDragging = state;
    if (!state) {
      this.stopScroll();
    }
  }

  // #region Scrolling
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const y = event.clientY;
    this.checkZone(y);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;

    const y = event.touches[0].clientY;
    this.checkZone(y);
  }

  /**
 * Prüft, ob der Maus-/Fingerzeiger sich im oberen oder unteren Scroll-Bereich befindet
 * und startet bzw. stoppt das automatische Scrollen je nach Zone und Richtung.
 * @param y - Die aktuelle Y-Position des Zeigers/Fingers (clientY)
 */
  checkZone(y: number): void {
    if (y > 0 && y < 200) {
      if (!this.isInScrollZone || this.scrollDirection !== 'up') {
        this.isInScrollZone = true;
        this.startScroll('up');
      }
    } else if (y > window.innerHeight - 200 && y < window.innerHeight) {
      if (!this.isInScrollZone || this.scrollDirection !== 'down') {
        this.isInScrollZone = true;
        this.startScroll('down');
      }
    } else {
      if (this.isInScrollZone) {
        this.isInScrollZone = false;
        this.stopScroll();
      }
    }
  }

  /**
 * Startet das automatische Scrollen in die angegebene Richtung.
 * Stellt sicher, dass nie mehrere Scroll-Intervalle gleichzeitig laufen.
 * @param direction - 'up' für nach oben, 'down' für nach unten
 */
  private startScroll(direction: 'up' | 'down'): void {
    if (this.scrollIntervalId !== null && this.scrollDirection === direction)
      return;

    this.stopScroll();
    this.scrollDirection = direction;
    this.scrollIntervalId = window.setInterval(() => {
      if (!this.isDragging) {
        this.stopScroll();
        return;
      }
      const wrapper = this.boardWrapper.nativeElement;
      const current = wrapper.scrollTop;
      const next = direction === 'up' ? current - 50 : current + 50;

      wrapper.scrollTo({
        top: next,
        behavior: 'auto',
      });
    }, 10);
  }

  /**
 * Stoppt das automatische Scrollen und räumt das Scroll-Intervall auf.
 * Setzt auch alle zugehörigen Statusvariablen zurück.
 */
  private stopScroll(): void {
    if (this.scrollIntervalId !== null) {
      window.clearInterval(this.scrollIntervalId);
      this.scrollIntervalId = null;
      this.scrollDirection = null;
    }
    this.isInScrollZone = false;
  }
  // #endregion

  // #endregion

  // Task-Dialog-Verwaltungsmethoden (minimal gehalten für neue Struktur)
  openTaskDetails(task: Task): void {
    // console.log('Opening task details for:', task);

    // Ensure clean state before opening dialog
    this.selectedTask = null;
    this.showTaskDialog = false;
    this.isEditMode = false;

    // Force change detection to process the reset
    this.cdr.detectChanges();

    // Set new state
    this.selectedTask = task;
    this.showTaskDialog = true;

    // Force another change detection cycle to ensure dialog appears
    this.cdr.detectChanges();

    // Ursprüngliche Form-Befüllung (auskommentiert - jetzt in TaskEditForm)
    // this.populateEditForm(task);
  }

  closeTaskDialog(): void {
    this.showTaskDialog = false;
    this.selectedTask = null;
    this.isEditMode = false;
    // Ursprüngliches Overlay-Schließen (auskommentiert aber beibehalten)
    // this.isOverlayOpen = false;
  }

  editTask(): void {
    this.isEditMode = true;
    // Ursprüngliche Edit-Modus-Einrichtung (auskommentiert - jetzt in TaskEditForm)
    // if (this.selectedTask) {
    //   this.populateEditForm(this.selectedTask);
    // }
  }

  // Vereinfachte Speichermethode (ursprüngliche Form-Behandlung zu TaskEditForm verschoben)
  async saveTask(task: Task): Promise<void> {
    if (!task.id) return;

    try {
      // Ursprüngliche Form-Validierung (auskommentiert - jetzt in TaskEditForm)
      // if (this.editForm.valid) {
      //   const formValue = this.editForm.value;

      const updateData: Partial<Task> = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedUsers: task.assignedUsers,
        dueDate: task.dueDate,
        subtasks: task.subtasks,
      };

      await this.taskDataService.updateTask(task.id, updateData);
      this.selectedTask = task;
      this.isEditMode = false;
      // Ursprüngliche Erfolgsbehandlung (beibehalten)
      // this.closeTaskDialog();
      // }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await this.taskDataService.deleteTask(taskId);
      this.closeTaskDialog();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  }

  async toggleSubtask(subtask: Subtask): Promise<void> {
    subtask.completed = !subtask.completed;
    if (this.selectedTask?.id) {
      const updateData: Partial<Task> = {
        subtasks: this.selectedTask.subtasks,
      };
      await this.taskDataService.updateTask(this.selectedTask.id, updateData);
    }
  }

  // Kann für schnelle Tests auf ein Element per (click)="" gestetzt werden, so lang das addTask form noch nicht bereit ist
  instantAddTask(status: 'todo' | 'inprogress' | 'awaiting' | 'done') {
    const instantTask: Task = {
      // id wird vom Firestore vergeben, daher optional und hier weglassen
      title: 'Instant-Task',
      description: 'Das ist ein automatisch erzeugtes Beispiel-Task.',
      category: 'User Story',
      priority: 'medium',
      status: status,
      assignedUsers: [
        'Ronald Berger',
        'Zwei Two',
        'Drei Three',
        'Vier Four',
        'Fünf Five',
        'Six Sechs',
      ],
      createdDate: new Date(),
      dueDate: new Date(Date.now() + 604800000), // +7 Tage
      subtasks: [
        {
          id: 'sub1',
          title: 'Drag and Drop Service integrieren',
          completed: true,
        },
        {
          id: 'sub2',
          title: 'Task-Positionen nach Drop speichern',
          completed: false,
        },
        {
          id: 'sub3',
          title: 'Test my progressbar',
          completed: false,
        },
      ],
    };

    this.taskDataService.addTask(instantTask);
  }

  openAddTaskComponent() {
    this.router.navigateByUrl('/addTask');
  }

  openAddTaskOverlay(taskStatus: BoardStatus) {
    this.openAddTask = true;
    this.setTaskStatus = taskStatus;
  }

  closeAddTaskOverlay() {
    this.openAddTask = false;
  }

  stopEvent(event: Event) {
    event.stopPropagation();
  }

  // #region Search functionality
  performSearch(): void {
    this.searchSubject.next(this.searchTerm.toLowerCase().trim());
  }

  private filterTasksBySearchTerm(
    columns: BoardColumn[],
    searchTerm: string
  ): BoardColumn[] {
    if (!searchTerm) {
      this.hasSearchResults = true;
      return columns;
    }

    const filteredColumns = columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          (task.description &&
            task.description.toLowerCase().includes(searchTerm))
      ),
    }));

    const totalFilteredTasks = filteredColumns.reduce(
      (total, column) => total + column.tasks.length,
      0
    );
    this.hasSearchResults = totalFilteredTasks > 0;

    return filteredColumns;
  }
  // #endregion
}
