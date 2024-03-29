from setuptools import setup, find_packages

with open('README.md', 'r') as fh:
    long_description = fh.read()

setup(
    name='d2e_dbsvc',
    version='0.0.1',
    packages=find_packages(exclude=['test']),
    python_requires='>=3.10',
    include_package_data=True,
    package_data={
         "": [
             'nodejs/**/*'
         ]
    },
    install_requires=["prefect-shell==0.2.1","prefect==2.14.6"],
    author='D4L data4life',
    author_email='we@data4life.care',
    url='https://www.data4life.care',
    description='Python interface to D4L D2E Db-Svc',
    long_description=long_description,
    long_description_content_type='text/markdown',
    license='',
    keywords='dbsvc d4l d2e dataflow prefect'
)