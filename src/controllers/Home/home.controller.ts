import { Router } from 'express'
import homeService from '@service/Home/home.service'

const Home = Router()
/**
 * @swagger
 * /Employees:
 *   delete:
 *     description: Create an Employee
 *     parameters:
 *     - name: EmployeeName
 *       description: Create an new employee
 *       in: formData
 *       required: true
 *       type: String
 *     responses:
 *       201:
 *         description: Created
 *
 */
Home.get('/', homeService.welcome)

export default Home
