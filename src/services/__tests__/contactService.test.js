import contactService from '../contactService';
import axiosInstance from '../axiosInstance';

jest.mock('../axiosInstance');

describe('contactService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('should send a message with valid data', async () => {
      const payload = {
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean@example.com',
        subject: 'Test',
        message: 'This is a test message that is long enough'
      };

      const mockResponse = {
        data: {
          message: 'Message sent successfully',
          data: {
            id: 1,
            ...payload,
            is_read: false,
            replied_at: null,
            admin_notes: '',
            created_at: '2025-12-10T00:00:00Z',
            updated_at: '2025-12-10T00:00:00Z'
          }
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await contactService.createMessage(payload);

      expect(axiosInstance.post).toHaveBeenCalledWith('contact/messages/', payload);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error for invalid email', async () => {
      const payload = {
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'invalid-email',
        message: 'This is a test message'
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            email: ['Entrez une adresse e-mail valide.']
          }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      try {
        await contactService.createMessage(payload);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('Entrez une adresse e-mail valide');
        expect(error.status).toBe(400);
      }
    });

    it('should throw error for message too short', async () => {
      const payload = {
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean@example.com',
        message: 'Too short'
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: ['Le message doit contenir au moins 10 caractères']
          }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      try {
        await contactService.createMessage(payload);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('au moins 10 caractères');
        expect(error.status).toBe(400);
      }
    });

    it('should handle network errors', async () => {
      const payload = {
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean@example.com',
        message: 'This is a test message'
      };

      const mockError = {
        response: {
          status: 500,
          data: { error: 'Internal server error' }
        }
      };

      axiosInstance.post.mockRejectedValue(mockError);

      try {
        await contactService.createMessage(payload);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.status).toBe(500);
      }
    });
  });

  describe('getMessages', () => {
    it('should fetch messages list', async () => {
      const mockResponse = {
        data: {
          count: 2,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              first_name: 'Jean',
              last_name: 'Dupont',
              email: 'jean@example.com',
              message: 'Test message 1'
            },
            {
              id: 2,
              first_name: 'Marie',
              last_name: 'Martin',
              email: 'marie@example.com',
              message: 'Test message 2'
            }
          ]
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contactService.getMessages();

      expect(axiosInstance.get).toHaveBeenCalledWith('contact/messages/', { params: {} });
      expect(result.count).toBe(2);
      expect(result.results.length).toBe(2);
    });
  });

  describe('getMessage', () => {
    it('should fetch a single message', async () => {
      const mockResponse = {
        data: {
          id: 1,
          first_name: 'Jean',
          last_name: 'Dupont',
          email: 'jean@example.com',
          message: 'Test message'
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contactService.getMessage(1);

      expect(axiosInstance.get).toHaveBeenCalledWith('contact/messages/1/');
      expect(result.id).toBe(1);
    });
  });

  describe('markAsRead', () => {
    it('should mark a message as read', async () => {
      const mockResponse = {
        data: {
          message: 'Message marked as read',
          data: {
            id: 1,
            is_read: true
          }
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await contactService.markAsRead(1);

      expect(axiosInstance.post).toHaveBeenCalledWith('contact/messages/1/mark_as_read/');
      expect(result.data.is_read).toBe(true);
    });
  });

  describe('statistics', () => {
    it('should fetch contact statistics', async () => {
      const mockResponse = {
        data: {
          total_messages: 10,
          unread_messages: 3,
          replied_messages: 7,
          pending_messages: 3
        }
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contactService.statistics();

      expect(axiosInstance.get).toHaveBeenCalledWith('contact/messages/statistics/');
      expect(result.total_messages).toBe(10);
    });
  });

  describe('bulkMarkAsRead', () => {
    it('should mark multiple messages as read', async () => {
      const mockResponse = {
        data: {
          message: '3 message(s) marked as read',
          updated_count: 3
        }
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await contactService.bulkMarkAsRead([1, 2, 3]);

      expect(axiosInstance.post).toHaveBeenCalledWith('contact/messages/bulk_mark_as_read/', {
        message_ids: [1, 2, 3]
      });
      expect(result.updated_count).toBe(3);
    });
  });
});
