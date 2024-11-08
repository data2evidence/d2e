import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { checkDbId, checkServiceScope } from './route-check'
import { SERVICE_SCOPE } from '../const'

describe('route-check', () => {
  describe('checkDbId', () => {
    const mockRes = {} as unknown as Response
    mockRes.status = jest.fn(() => mockRes)
    mockRes.send = jest.fn(message => message)
    const mockNext = jest.fn() as NextFunction

    it('should return bad request with error message if id is undefined', () => {
      const mockReq = {} as Request

      const result = checkDbId(mockReq, mockRes, mockNext)

      expect(result).toBe('Param is required')
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockNext).toHaveBeenCalledTimes(0)
    })
    it('should return bad request with error message if id is not uuid', () => {
      const mockReq = { params: { id: 'hello' } } as unknown as Request

      const result = checkDbId(mockReq, mockRes, mockNext)

      expect(result).toBe('Param is invalid')
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockNext).toHaveBeenCalledTimes(0)
    })
    it('should trigger next if id is valid uuid', () => {
      const mockReq = { params: { id: uuidv4() } } as unknown as Request

      checkDbId(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalled()
    })
  })
  describe('checkServiceScope', () => {
    const mockRes = {} as unknown as Response
    mockRes.status = jest.fn(() => mockRes)
    mockRes.send = jest.fn(message => message)
    const mockNext = jest.fn() as NextFunction

    it('should return bad request with error message if service scope is undefined', () => {
      const mockReq = {} as Request

      const result = checkServiceScope(mockReq, mockRes, mockNext)

      expect(result).toBe('Query param is required')
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockNext).toHaveBeenCalledTimes(0)
    })
    it('should return bad request with error message if service scope is not of type string', () => {
      const mockReq = { query: { serviceScope: [SERVICE_SCOPE.INTERNAL] } } as unknown as Request

      const result = checkServiceScope(mockReq, mockRes, mockNext)

      expect(result).toBe('Query param is invalid')
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockNext).toHaveBeenCalledTimes(0)
    })
    it('should return bad request with error message if service scope is invalid', () => {
      const mockReq = { query: { serviceScope: 'invalid' } } as unknown as Request

      const result = checkServiceScope(mockReq, mockRes, mockNext)

      expect(result).toBe('Query param is invalid')
      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockNext).toHaveBeenCalledTimes(0)
    })
    it('should trigger next if service scope is valid', () => {
      const mockReq = { query: { serviceScope: SERVICE_SCOPE.DATA_PLATFORM } } as unknown as Request

      checkServiceScope(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalled()
    })
  })
})
