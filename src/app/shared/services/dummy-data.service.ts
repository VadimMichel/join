import { Injectable } from '@angular/core';
import { ContactDataService } from '../../main-pages/shared-data/contact-data.service';
import { TaskDataService } from '../../main-pages/shared-data/task-data.service';
import { Contacts } from '../../main-pages/contacts-interface';
import { Task } from '../../main-pages/shared-data/task.interface';
import { take, firstValueFrom } from 'rxjs';

/**
 * Fresh Dummy Data Service
 * 
 * Provides a clean system to load sample data for new users and guests.
 * Ensures no duplicates and restores original state each time.
 */
@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  /**
   * Flag to track if dummy data is currently being loaded
   */
  private isLoading = false;

  /**
   * User ID to track which user has dummy data loaded
   */
  private currentDummyDataUserId: string | null = null;

  constructor(
    private contactDataService: ContactDataService,
    private taskDataService: TaskDataService
  ) {}

  /**
   * Main method to load dummy data for a user
   * Called from login components after successful authentication
   * @param userId - The user's unique identifier
   * @param userContact - Optional user contact to add after dummy data (for logged-in users)
   */
  async loadDummyDataForUser(userId: string, userContact?: Partial<Contacts>): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
      await this.clearAllData();
      await this.createDummyContacts();
      await this.createDummyTasks();
      
      if (userContact && userContact.name && userContact.email) {
        await this.contactDataService.addContact(userContact as Contacts);
      }
      
      this.currentDummyDataUserId = userId;
    } catch (error) {
      console.error('Error loading dummy data:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Clears all existing data to ensure clean state
   */
  private async clearAllData(): Promise<void> {
    try {
      const tasks = await this.getAllTasks();
      for (const task of tasks) {
        if (task.id) {
          await this.taskDataService.deleteTask(task.id);
        }
      }

      const contacts = await this.getAllContacts();
      for (const contact of contacts) {
        if (contact.id) {
          await this.contactDataService.deleteContact(contact.id);
        }
      }
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  /**
   * Gets all tasks from the service
   */
  private async getAllTasks(): Promise<Task[]> {
    return firstValueFrom(this.taskDataService.tasks$);
  }

  /**
   * Gets all contacts from the service
   */
  private async getAllContacts(): Promise<Contacts[]> {
    const allContacts: Contacts[] = [];
    for (const group of this.contactDataService.contactlist) {
      allContacts.push(...group.contacts);
    }
    return allContacts;
  }

  /**
   * Creates exactly 10 dummy contacts
   */
  private async createDummyContacts(): Promise<void> {
    const contacts: Omit<Contacts, 'id'>[] = [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@demomail.com',
        phone: '+1 (555) 123-4567'
      },
      {
        name: 'Bob Smith',
        email: 'bob.smith@demomail.com',
        phone: '+1 (555) 234-5678'
      },
      {
        name: 'Carol Davis',
        email: 'carol.davis@demomail.com',
        phone: '+1 (555) 345-6789'
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@demomail.com',
        phone: '+1 (555) 456-7890'
      },
      {
        name: 'Emma Brown',
        email: 'emma.brown@demomail.com',
        phone: '+1 (555) 567-8901'
      },
      {
        name: 'Frank Miller',
        email: 'frank.miller@demomail.com',
        phone: '+1 (555) 678-9012'
      },
      {
        name: 'Grace Lee',
        email: 'grace.lee@demomail.com',
        phone: '+1 (555) 789-0123'
      },
      {
        name: 'Henry Taylor',
        email: 'henry.taylor@demomail.com',
        phone: '+1 (555) 890-1234'
      },
      {
        name: 'Isabella Martinez',
        email: 'isabella.martinez@demomail.com',
        phone: '+1 (555) 901-2345'
      },
      {
        name: 'Jack Anderson',
        email: 'jack.anderson@demomail.com',
        phone: '+1 (555) 012-3456'
      }
    ];

    for (const contact of contacts) {
      try {
        await this.contactDataService.addContact(contact as Contacts);
      } catch (error) {
        console.error(`Failed to add contact ${contact.name}:`, error);
      }
    }
  }

  /**
   * Creates coherent project tasks - one per kanban column
   */
  private async createDummyTasks(): Promise<void> {
    const tasks: Omit<Task, 'id'>[] = [
      {
        title: 'E-Commerce Platform - Project Planning',
        description: 'Plan the complete e-commerce platform project including requirements analysis, technology stack selection, and timeline creation.',
        assignedUsers: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
        dueDate: this.getFutureDate(7),
        createdDate: new Date(),
        priority: 'urgent',
        category: 'User Story',
        subtasks: [
          { id: 'st1', title: 'Analyze business requirements', completed: false },
          { id: 'st2', title: 'Define technical specifications', completed: false },
          { id: 'st3', title: 'Create project timeline', completed: false },
          { id: 'st4', title: 'Set up development environment', completed: false }
        ],
        status: 'todo'
      },
      {
        title: 'E-Commerce Platform - Backend Development',
        description: 'Develop the core backend infrastructure including API design, database setup, and authentication system.',
        assignedUsers: ['David Wilson', 'Frank Miller', 'Grace Lee'],
        dueDate: this.getFutureDate(14),
        createdDate: new Date(),
        priority: 'urgent',
        category: 'Technical Task',
        subtasks: [
          { id: 'st5', title: 'Design REST API structure', completed: true },
          { id: 'st6', title: 'Set up database schema', completed: true },
          { id: 'st7', title: 'Implement user authentication', completed: false },
          { id: 'st8', title: 'Create product management APIs', completed: false }
        ],
        status: 'inprogress'
      },
      {
        title: 'E-Commerce Platform - UI/UX Design',
        description: 'Complete user interface design for the e-commerce platform including wireframes, mockups, and user experience flow.',
        assignedUsers: ['Henry Taylor', 'Isabella Martinez', 'Emma Brown'],
        dueDate: this.getFutureDate(10),
        createdDate: new Date(),
        priority: 'medium',
        category: 'User Story',
        subtasks: [
          { id: 'st9', title: 'Create wireframes', completed: true },
          { id: 'st10', title: 'Design product catalog pages', completed: true },
          { id: 'st11', title: 'Design checkout process', completed: true },
          { id: 'st12', title: 'Submit for stakeholder review', completed: true }
        ],
        status: 'awaiting'
      },
      {
        title: 'E-Commerce Platform - Database Setup',
        description: 'Complete database architecture design and implementation with all necessary tables, relationships, and indexes.',
        assignedUsers: ['Jack Anderson', 'Alice Johnson'],
        dueDate: this.getPastDate(5),
        createdDate: new Date(),
        priority: 'urgent',
        category: 'Technical Task',
        subtasks: [
          { id: 'st13', title: 'Design database schema', completed: true },
          { id: 'st14', title: 'Create user and product tables', completed: true },
          { id: 'st15', title: 'Set up order management tables', completed: true },
          { id: 'st16', title: 'Configure database indexes', completed: true }
        ],
        status: 'done'
      }
    ];

    for (const task of tasks) {
      try {
        await this.taskDataService.addTask(task as Task);
      } catch (error) {
        console.error(`Failed to add task ${task.title}:`, error);
      }
    }
  }

  /**
   * Get a future date X days from now
   */
  private getFutureDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  /**
   * Get a past date X days ago
   */
  private getPastDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  /**
   * Check if dummy data is currently being loaded
   */
  public isLoadingData(): boolean {
    return this.isLoading;
  }

  /**
   * Reset the service state (useful for testing)
   */
  public reset(): void {
    this.isLoading = false;
    this.currentDummyDataUserId = null;
  }
}
